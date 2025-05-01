"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";

export default function AddExpense() {
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState(10);

  const [daily, setDaily] = useState({});
  const [monthly, setMonthly] = useState({});
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    async function fetchSummary() {
      const res = await fetch("/api/summary");
      const data = await res.json();
      setDaily(data.daily || {});
      setMonthly(data.monthly || {});
    }
    fetchSummary();
  }, []);

  async function AddExpense() {
    if (message === "" || price === 0) return;
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, price }),
      });

      if (!res.ok) {
        throw new Error("Failed to add expense");
      }
      
      const data = await res.json();
      Swal.fire({
        title: "ไม่น้าตังกำลังปลิวออกไปปป",
        text: "ตังกำลังจะหมดแล้วนะเว้ยยย",
        backdrop: `
                rgba(105, 105, 105, 0.8)
                url("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTI0cm1qbXR2Y2ZiZzg1Y2pwNTJxYWk0YTE4OGhnZjg1dmZpcG8waCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/14SGx6CtrLrj7dvOa3/giphy.gif") 
                center top 
                no-repeat 
            `,
        showConfirmButton: false,
        timer: 2000,
        icon: "success",
        timerProgressBar: true,
      });
      setMessage("");
      setPrice(10);
    } catch (error) {
      console.log("aaaaa ");
    }
  }
  return (
    <div>
      <div className="flex justify-center">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className=" bg-purple-500 mt-2 hover:bg-purple-400 rounded-md p-2 text-center"
        >
          {resolvedTheme === "dark" ? "มืดเกินไปรึป่าว?" : "แสบตาเกินไปป่าว?"}
        </button>
      </div>

      <div className="grid bg-neutral-300 dark:bg-neutral-500 dark:text-black rounded-md gap-5 p-2 mt-2">
        <label className="text-lg font-bold border-b ">สรุปยอดหน่อยดิ</label>
        <label>
          ยอดรายวัน{" "}
          {Object.entries(daily).map(([date, total]) => (
            <li key={date}>
              {date} — {total.toLocaleString()} ฿
            </li>
          ))}
        </label>
        <label>
          ยอดรายเดือน{" "}
          {Object.entries(monthly).map(([month, total]) => (
            <li key={month}>
              เดือน {month} — {total.toLocaleString()} ฿
            </li>
          ))}
        </label>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          AddExpense();
        }}
      >
        <div className="grid bg-neutral-300 dark:bg-neutral-500 dark:text-black rounded-md gap-4 p-2 mt-2">
          <label className="text-lg font-bold border-b">
            เพิ่มรายจ่ายดิรออะไร
          </label>
          <label>รายจ่ายค่าไรวะ?</label>
          <input
            className="border-2 rounded-md text-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ข้อความเท่านั้น!!!"
            required
            type="text"
          />
          <label>เท่าไหร่วะ?</label>
          <input
            className="border-2 rounded-md text-black"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="ตัวเลขเท่านั้น!!!"
            type="number"
            required
            min={1}
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-400 rounded-md dark:text-white"
          >
            บันทึกโว้ยยย
          </button>
        </div>
      </form>
    </div>
  );
}
