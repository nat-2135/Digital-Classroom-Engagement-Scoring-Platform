// Pure JS Prediction Engine for Engagement Data

export const calculateTrend = (scores = []) => {
    if (!scores || scores.length < 2) {
        return {
            status: "steady",
            slope: 0,
            prediction: scores && scores.length > 0 ? scores[scores.length - 1] : 0,
            label: "Not enough data"
        };
    }

    const weights = [1, 2, 3, 4, 5].slice(0, Math.min(scores.length, 5));
    const recentScores = scores.slice(-3);

    let totalDiff = 0;
    for (let i = 1; i < recentScores.length; i++) {
        totalDiff += (recentScores[i] - recentScores[i - 1]);
    }

    const slope = recentScores.length > 1 ? totalDiff / (recentScores.length - 1) : 0;

    let status = "steady";
    if (slope < -3) status = "at_risk";
    else if (slope > 3) status = "recovering";

    const lastScore = scores[scores.length - 1];
    const prediction = Math.max(0, Math.min(100, lastScore + slope));

    return { status, slope, prediction, label: status === "at_risk" ? "Declining" : status === "recovering" ? "Improving" : "Steady" };
};

export const generateFeedback = (scores = [], name = "Student") => {
    if (!scores || scores.length === 0) return "No data available.";

    const lastScore = scores[scores.length - 1];
    const trend = calculateTrend(scores);

    if (lastScore < 50) return `Critically low (${(lastScore || 0).toFixed(1)}). Immediate attention needed for ${name}.`;

    // Check declining 3+ weeks
    if (scores.length >= 3) {
        const last3 = scores.slice(-3);
        if (last3[0] > last3[1] && last3[1] > last3[2]) {
            return "Consistent decline. Recommend one-on-one.";
        }
    }

    if (trend.status === "recovering") return "Showing improvement. Positive reinforcement recommended.";

    if (scores.length >= 2 && scores[scores.length - 2] > scores[scores.length - 1] + 10) {
        return "Unusual drop. May be temporary — monitor closely.";
    }

    return "Performance is stable. Keep up the good work!";
};

export const getStudentTrendMessage = (scores = []) => {
    if (!scores || scores.length < 2) return { emoji: "✅", message: "On track! Consistency is key.", color: "#3b82f6" };

    const cleanScores = scores.filter(s => s !== null && s !== undefined);
    if (cleanScores.length < 2) return { emoji: "✅", message: "Collecting data...", color: "#3b82f6" };

    const trend = calculateTrend(cleanScores);

    if (trend.status === "at_risk") {
        return { emoji: "📉", message: "Slipping lately. Small steps make a difference!", color: "#f59e0b" };
    } else if (trend.status === "recovering") {
        return { emoji: "🌟", message: "Great improvement! Keep the momentum!", color: "#059669" };
    }

    return { emoji: "✅", message: "On track! Consistency is key.", color: "#3b82f6" };
};
