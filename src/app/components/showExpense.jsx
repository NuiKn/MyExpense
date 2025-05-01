"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
export default function ShowExpense() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchExpenses = async () => {
    const res = await fetch(`/api/expenses?search=${search}&sortKey=${sortKey}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`);
    const data = await res.json();
    setExpenses(data.data);
  };

  async function handleDelete(line) {
    const result = await Swal.fire({
      title: "จะลบจริงดิ?",
      text: "ลบแล้วหายเลยนะเว้ยย",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "ไม่ลบละ",
      confirmButtonText: "ลบดิรอไร!",
    });

    if (result.isConfirmed) {
      const res = await fetch("/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line }),
      });

      if (res.ok) {
        Swal.fire({
          title: "เย้ตังกลับมาแล้ววววว",
          text: "ใช้ต่อดิรอไรรร",
          backdrop: `
                        rgba(105, 105, 105, 0.8)
                        url("https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTh1bXV1Nm9sMHp4MjZtZTJscTVhZWdkZnZmOWJmYWl3NDk5c3NtNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/4Ztytt2s2Cr7XyTI1z/giphy.gif") 
                        center top 
                        no-repeat 
                    `,
          showConfirmButton: false,
          timer: 2000,
          icon: "success",
          timerProgressBar: true,
        });
        fetchExpenses();
      } else {
        Swal.fire("พลาดได้ไง", "ไม่น่าเชื่ออ", "error");
      }
    }
  }

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    fetchExpenses();
  }, [search,sortKey,sortOrder,page]);

  return (
    <div className="grid bg-neutral-300 dark:bg-neutral-500 dark:text-black rounded-md gap-3 p-2 mt-2 overflow-x-auto">
      <label className="text-lg font-bold border-b">มีไรบ้างวะรายงานดิ</label>
      <div className="grid sm:flex sm:justify-between gap-2">
        <div className="flex gap-2">
          <select
            onChange={(e) => setSortKey(e.target.value)} className="border px-2 py-1 rounded"
          >
            <option value="">เรียงตาม</option>
            <option value="message">รายการ</option>
            <option value="price">ราคา</option>
            <option value="date">วันที่</option>
          </select>
          <select
            onChange={(e) => setSortOrder(e.target.value)} className="border px-2 py-1 rounded"
          >
            <option value="asc">จากน้อยไปมาก</option>
            <option value="desc">จากมากไปน้อย</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="ค้นหาวันที่หรือรายการ"
          className="border px-2 py-1 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="border rounded-md text-sm min-h-[382px]">
        <thead>
          <tr className="bg-gray-200 dark:dark:bg-neutral-600">
            <th className="border px-2 py-1">วันที่</th>
            <th className="border px-2 py-1">รายการ</th>
            <th className="border px-2 py-1">ราคา</th>
            <th className="border px-2 py-1">เวลา</th>
            <th className="border px-2 py-1">ลบ</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-2">
                รวยแล้วรึไง ไม่มีรายจ่าย เพิ่มดิรอไร
              </td>
            </tr>
          ) : (
            expenses.map((exp, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{exp.date}</td>
                <td className="border px-2 py-1">{exp.message}</td>
                <td className="border px-2 py-1">{exp.price}</td>
                <td className="border px-2 py-1">{exp.time}</td>
                <td className="border px-2 py-1">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(exp.line)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-center items-center text-sm mt-1">
        {/* Previous Page */}
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-purple-500 dark:text-white px-4 py-2 rounded disabled:bg-gray-500 dark:disabled:bg-gray-600"
        >
          ก่อนหน้า
        </button>

        {/* Page Numbers */}
        <div className="text-center p-2">
          <span className="font-semibold">{page}</span>
        </div>

        {/* Next Page */}
        <button
          onClick={handleNextPage}
          className="bg-purple-500 dark:text-white px-4 py-2 rounded"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}
