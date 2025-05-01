"use client";
import AddExpense from "./components/addExpense";
import ShowExpense from "./components/showExpense";
export default function Home() {


  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-5xl mt-2 p-2">
        <div className="grid text-center">
          <p className="text-purple-500 text-3xl font-bold">บันทึกดิวะ</p>
          <p className="text-lg font-bold dark:text-white">ดูดิว่าตังหายไปไหน?</p>
        </div>
        <div className="grid md:flex gap-2">
          <div className="md:w-1/3">
            <AddExpense></AddExpense>
          </div>
          <div className="w-full overflow-x-auto">
            <ShowExpense></ShowExpense>
          </div>
          

        </div>
      </div>
    </div>
  );
}
