import Expense from "../models/expense.js";
import { parseDate, parsePrice } from "../utils/parseFilters.js";

// let expenses = [
//   {
//     id: 1212,
//     title: "Launch1",
//     description: "This is luanch",
//   },
//   {
//     id: 1341,
//     title: "Launch2",
//     description: "This is luanch",
//   },
// ];


export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    const expenses = await Expense.find({
      userId,
      hidden: false,
    }).sort("-createdAt");

    // 👉 Total
    const total = expenses.reduce((sum, e) => sum + e.rs, 0);

    // 👉 Weekly comparison
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);

    const prevWeek = new Date();
    prevWeek.setDate(now.getDate() - 14);

    const thisWeekExpenses = expenses.filter(
      (e) => new Date(e.createdAt) >= lastWeek
    );

    const prevWeekExpenses = expenses.filter(
      (e) =>
        new Date(e.createdAt) >= prevWeek &&
        new Date(e.createdAt) < lastWeek
    );

    const thisWeekTotal = thisWeekExpenses.reduce(
      (sum, e) => sum + e.rs,
      0
    );

    const prevWeekTotal = prevWeekExpenses.reduce(
      (sum, e) => sum + e.rs,
      0
    );

    let pct_change = 0;
    if (prevWeekTotal > 0) {
      pct_change =
        ((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100;
    }

    // 👉 Payment Map
    const paymentMap = {};
    expenses.forEach((e) => {
      paymentMap[e.paymentMethod] =
        (paymentMap[e.paymentMethod] || 0) + e.rs;
    });

    // 👉 Top Payment Method
    let topPaymentMethodUsed = null;
    let max = 0;

    for (let key in paymentMap) {
      if (paymentMap[key] > max) {
        max = paymentMap[key];
        topPaymentMethodUsed = {
          name: key,
          amount: paymentMap[key],
        };
      }
    }

    // 👉 Pie chart data
    const paymentMethodBreakdown = Object.keys(paymentMap).map((key) => ({
      name: key,
      amount: paymentMap[key],
    }));

    // 👉 Peak Day
    const dayMap = {};
    expenses.forEach((e) => {
      const day = new Date(e.createdAt).toDateString();
      dayMap[day] = (dayMap[day] || 0) + e.rs;
    });

    let peakDay = null;
    let maxDay = 0;

    for (let day in dayMap) {
      if (dayMap[day] > maxDay) {
        maxDay = dayMap[day];
        peakDay = {
          date: new Date(day),
          amount: dayMap[day],
        };
      }
    }

    // 👉 Chart fallback (last 7 days)
    const labels = [];
    const series = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dayStr = d.toDateString();

      const dayTotal = expenses
        .filter(
          (e) => new Date(e.createdAt).toDateString() === dayStr
        )
        .reduce((sum, e) => sum + e.rs, 0);

      labels.push(d.toLocaleDateString());
      series.push(dayTotal);
    }

    // 👉 🔥 TAKE ACTION LOGIC
    let action = {
      label: "",
      tip: "",
    };

    if (thisWeekTotal > prevWeekTotal) {
      action = {
        label: "Spending Increased ⚠️",
        tip: "Your spending is higher than last week. Try cutting down on unnecessary expenses.",
      };
    } else if (thisWeekTotal < prevWeekTotal) {
      action = {
        label: "Good Control ✅",
        tip: "Nice! You spent less than last week. Keep maintaining this habit.",
      };
    } else {
      action = {
        label: "Stable Spending 👍",
        tip: "Your spending is stable. Keep tracking regularly.",
      };
    }

    // 👉 FINAL RESPONSE
    res.json({
      total: thisWeekTotal,
      pct_change: Math.round(pct_change),
      trend: pct_change >= 0 ? "up" : "down",
      topPaymentMethodUsed,
      paymentMethodBreakdown,
      peakDay,
      action, // 🔥 ADDED
      chart: {
        labels,
        series,
      },
      recentTransactions: expenses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};


//get expenses
export const getExpenses = async (req, resp) => {
  //userid
  const userId = req.userId;
  if (!userId) {
    return resp.status(403).json({
      message: "invalid request",
    });
  }

  const { minPrice, maxPrice, fromDate, toDate } = req.query;

  let filter = {
    hidden: false,
    userId: userId,
  };

  // const fromDateParsed = parseDate(fromDate);
  // const toDateParsed = parseDate(toDate);

  if (minPrice && maxPrice) {
    const minPriceParsed = parsePrice(minPrice);
    const maxPriceParsed = parsePrice(maxPrice);
    filter.rs = {
      $gte: minPriceParsed,
      $lte: maxPriceParsed,
    };
  }

  if (minPrice && !maxPrice) {
    const minPriceParsed = parsePrice(minPrice);
    filter.rs = {
      $gte: minPriceParsed,
    };
  }

  if (maxPrice && !minPrice) {
    const maxPriceParsed = parsePrice(maxPrice);
    filter.rs = {
      $lte: maxPriceParsed,
    };
  }

  //getting the data from database
  const exps = await Expense.find(filter).sort("-createdAt");
  resp.status(200).json(exps);

  // resp.json(expenses);
};

//get single expense
export const getExpense = async (req, resp) => {
  //   console.log("params");
  //   console.log(req.params);
  const { expenseId } = req.params;
  //   console.log(expenseId);
  // const ex = expenses.find((item) => item.id == expenseId);
  // resp.json(ex);

  const expense = await Expense.findOne({
    _id: expenseId,
  });

  resp.status(200).json(expense);
};

//create expense
export const createExpense = async (req, resp) => {
  console.log(req.body);
  console.log("exp controller  userid ", req.userId);

  if (!req.userId) {
    return resp.status(403).json({
      message: "Invalid Request",
    });
  }

  const { title, description, rs, hidden, paymentMethod } = req.body;

// 🔥 FIX: ensure number
const amount = Number(rs);

const ob = await Expense.create({
  title,
  description,
  paymentMethod,
  rs: amount, // ✅ always number
  hidden,
  userId: req.userId,
});

  //save in database

  // expenses.push({
  //   title,
  //   description,
  //   id,
  // });
  resp.status(201).json(ob);
};

//delete expense
export const deleteExpense = async (req, resp) => {
  const { expenseId } = req.params;

  await Expense.updateOne(
    { _id: expenseId },
    { hidden: true } // 🔥 move to recycle bin
  );

  resp.json({
    message: "Moved to recycle bin",
  });
};
//update expense
export const updateExpense = async (req, resp) => {
  const { expId } = req.params;

  const { title, description, rs, hidden, paymentMethod } = req.body;

  // update to database
  await Expense.updateOne(
    {
      _id: expId,
    },
    {
      title,
      description,
      rs,
      hidden,
      paymentMethod,
    }
  );

  const updatedExpense = await Expense.findOne({
    _id: expId,
  });

  // const { title, description } = req.body;

  // expenses = expenses.map((exp) => {
  //   if (exp.id == expId) {
  //     /// update fir return
  //     exp.title = title;
  //     exp.description = description;
  //     return exp;
  //   } else {
  //     return exp;
  //   }
  // });

  // resp.send("Expense updated ");

  resp.status(200).json(updatedExpense);
};

//search by title
export const searchByTitle = async (req, resp) => {
  const { title } = req.query;
  console.log(title);
  // console.log(description);

  const expenses = await Expense.find({
    title: {
      $regex: title,
      $options: "i",
    },
  });

  resp.send(expenses);
};


// ✅ GET RECYCLE BIN DATA
export const getDeletedExpenses = async (req, res) => {
  try {
    const userId = req.userId;

    // 🔥 ADD THIS CHECK
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const deletedExpenses = await Expense.find({
      userId,
      hidden: true,
    }).sort("-createdAt");

    console.log("DELETED DATA:", deletedExpenses); // 🔥 debug

    res.json(deletedExpenses);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({
      message: "Error fetching deleted expenses",
    });
  }
};


// ✅ RESTORE EXPENSE
export const restoreExpense = async (req, res) => {
  const { expenseId } = req.params;

  await Expense.updateOne(
    { _id: expenseId },
    { hidden: false }
  );

  res.json({ message: "Restored successfully" });
};


// ✅ PERMANENT DELETE
export const permanentDeleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  await Expense.findByIdAndDelete(expenseId);

  res.json({ message: "Deleted permanently" });
};