import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join('/tmp', 'expense.txt');
/* const filePath = path.join(process.cwd(), "tmp", "expense.txt"); */

export async function GET() {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const lines = raw.split("\n").filter(Boolean);

    const dailyTotals = {};
    const monthlyTotals = {};

    let currentDate = null;

    for (const line of lines) {
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(line)) {
        currentDate = line; // เช่น "30/4/2568"
        if (!dailyTotals[currentDate]) dailyTotals[currentDate] = 0;
      } else if (currentDate) {
        const parts = line.split(" ");
        const price = parseFloat(parts[1]) || 0;
        dailyTotals[currentDate] += price;

        const [day, month, year] = currentDate.split("/");
        const monthKey = `${month}/${year}`; // เช่น "4/2568"
        if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
        monthlyTotals[monthKey] += price;
      }
    }
    // แปลง dailyTotals เป็น array แล้ว sort เอาวันล่าสุด
    const latestDays = Object.keys(dailyTotals)
      .sort((a, b) => {
        const [d1, m1, y1] = a.split("/").map(Number);
        const [d2, m2, y2] = b.split("/").map(Number);
        return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
      })
      .slice(0, 2); // เอาแค่ 2 วันล่าสุด

    // แปลง monthlyTotals เป็น array แล้ว sort เอาเดือนล่าสุด
    const latestMonths = Object.keys(monthlyTotals)
      .sort((a, b) => {
        const [m1, y1] = a.split("/").map(Number);
        const [m2, y2] = b.split("/").map(Number);
        return new Date(y2, m2 - 1) - new Date(y1, m1 - 1);
      })
      .slice(0, 2); // เอาแค่ 2 เดือนล่าสุด

    // แสดงผลเฉพาะวันและเดือนล่าสุด
    const finalDailyTotals = {};
    const finalMonthlyTotals = {};

    for (const day of latestDays) {
      finalDailyTotals[day] = dailyTotals[day];
    }

    for (const month of latestMonths) {
      finalMonthlyTotals[month] = monthlyTotals[month];
    }

    return NextResponse.json({
      daily: finalDailyTotals,
      monthly: finalMonthlyTotals,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error reading file", error: error.message },
      { status: 500 }
    );
  }
}
