import { useQuery } from "@tanstack/react-query";
import StatusButton from "../components/statusButton";
import Task from "../components/Task";
import { getData } from "../services/appApi";

const Home = () => {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getData("tasks"),
  });

console.log(tasks)


  return (
    <main className="px-30">
      <h1
        className="mt-10 mb-12.5 text-neutral-800
text-2xl
font-semibold"
      >
        დავალებების გვერდი
      </h1>

      <div className="flex justify-between">
        <section className="flex flex-col gap-7.5">
          <StatusButton status={"დასაწყები"} color={`bg-[#F7BC30]`} />

          {tasks.filter((task: { status: { name: string; }; }) => {
            return task?.status?.name == "დასაწყები"
          }).map((filt: { status: { name: string; }; id: string | number }) => {
            return <Task key={filt.id} data={filt} outline_col={`outline-[#F7BC30]`} />
          })}
        </section>

        <section className="flex flex-col gap-7.5">
          <StatusButton status={"პროგრესში"} color={`bg-[#FB5607]`} />

           {tasks.filter((task: { status: { name: string; }; }) => {
            return task?.status?.name == "პროგრესში"
          }).map((filt: { status: { name: string; }; id: string | number }) => {
            return <Task key={filt.id} data={filt} outline_col={`outline-[#FB5607]`} />
          })}

        </section>

        <section className="flex flex-col gap-7.5">
          <StatusButton status={"მზად ტესტირებისთვის"} color={`bg-[#FF006E]`} />
          {tasks.filter((task: { status: { name: string; }; }) => {
            return task?.status?.name == "მზად ტესტირებისთვის"
          }).map((filt: { status: { name: string; }; id: string | number }) => {
            return <Task key={filt.id} data={filt} outline_col={`outline-[#FF2080]`} />
          })}
        </section>

        <section className="flex flex-col gap-7.5">
          <StatusButton status={"დასრულებული"} color={`bg-[#3A86FF]`} />

           {tasks.filter((task: { status: { name: string; }; }) => {
            return task?.status?.name == "დასრულებული"
          }).map((filt: { status: { name: string; }; id: string | number }) => {
            return <Task key={filt.id} data={filt} outline_col={`outline-[#3A86FF]`} />
          })}
        </section>
      </div>
    </main>
  );
};

export default Home;
