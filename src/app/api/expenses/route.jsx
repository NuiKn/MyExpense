import { log } from "console";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

const filePath = path.join(process.cwd(), "expense.txt");
let fileContent = "";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const sortKey = searchParams.get("sortKey") || "";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const raw = fs.readFileSync(filePath, "utf-8");
    const lines = raw.split("\n").filter(Boolean);

    const result = [];
    let currentDate = null;

    for (const line of lines) {
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(line)) {
        currentDate = line;
      } else if (currentDate) {
        const [message, price, date, time] = line.split(" ");
        result.push({
          message,
          price: parseFloat(price),
          date,
          time,
          line,
        });
      }
    }

    let filtered = result;
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.message.includes(search) ||
          item.groupDate.includes(search) ||
          item.date.includes(search)
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        let aVal, bVal;
    
        if (sortKey === "price") {
          aVal = parseFloat(a[sortKey]);
          bVal = parseFloat(b[sortKey]);
        } else if (sortKey === "date") {
          const [d1, m1, y1] = a.date.split("/").map(Number);
          const [d2, m2, y2] = b.date.split("/").map(Number);
          aVal = new Date(y1, m1 - 1, d1);
          bVal = new Date(y2, m2 - 1, d2);
        } else {
          aVal = a[sortKey];
          bVal = b[sortKey];
        }
    
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    
    const paginated = filtered.slice(start, end);

    return NextResponse.json({ data: paginated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error reading file", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, price } = body;

    if (!message || price === 0) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const date = new Date();
    const currentDate = date.toLocaleDateString("th-TH");
    const currentTime = date.toLocaleTimeString("th-TH");

    try {
      fileContent = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      const initialContent = `${currentDate}\n`;
      fs.writeFileSync(filePath, initialContent, "utf-8");
      fileContent = initialContent;
    }

    const lastDateLine = fileContent
      .split("\n")
      .find((line) => line.includes(currentDate));

    if (!lastDateLine) {
      fileContent += `\n${currentDate}\n`;
    }

    fileContent += `${message} ${price} ${currentDate} ${currentTime}\n`;

    fs.writeFileSync(filePath, fileContent, "utf-8");

    return NextResponse.json(
      { message: "Expense saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to save expense", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { line } = await request.json();

    const raw = fs.readFileSync(filePath, "utf-8");
    const updated = raw
      .split("\n")
      .filter((l) => l.trim() !== line.trim())
      .join("\n");

    fs.writeFileSync(filePath, updated, "utf-8");
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }
}
