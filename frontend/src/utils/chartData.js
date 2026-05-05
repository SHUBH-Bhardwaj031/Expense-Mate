export const getDayWiseFromTransactions = (
  transactions = [],
  fallbackLabels = [],
  fallbackSeries = []
) => {
  // 👉 agar data nahi hai → fallback use karo
  if (!transactions || transactions.length === 0) {
    return {
      labels: fallbackLabels,
      data: fallbackSeries,
    };
  }


  
  const map = {};

  // 👉 sirf jahan transaction hua hai wahi count karo
  transactions.forEach((t) => {
    const date = new Date(t.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

    map[date] = (map[date] || 0) + Number(t.rs || 0);
  });

  // 👉 sort by date
  const sortedEntries = Object.entries(map).sort(
    (a, b) => new Date(a[0]) - new Date(b[0])
  );

  return {
    labels: sortedEntries.map(([date]) => date),
    data: sortedEntries.map(([_, value]) => value),
  };
};

export const getPaymentMethodData = (breakdown = []) => {
  if (!breakdown || breakdown.length === 0) {
    return {
      labels: [],
      data: [],
    };
  }

  const labels = breakdown.map((item) => item.name);
  const data = breakdown.map((item) => item.amount);

  return { labels, data };
};