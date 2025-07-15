import { useEffect, useRef, useState } from 'react';
import './App.css'

interface WorkoutType {
  _id?: string
  title: string;
  reps: number;
  load: number;
  createdAt?: string
}

type WorkoutFormType = {
  title: string;
  load: number;
  reps: number;
}
function App() {
  const modalAddRef = useRef<HTMLDialogElement | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutType[] | undefined>(undefined);

  const [form, setForm] = useState<WorkoutFormType>({
    title: "",
    load: 1,
    reps: 1
  });

  const volume = workouts?.reduce((sum, w) => sum + w.load * w.reps, 0) ?? 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "load" || name === "reps" ? Number(value) : value,
    }));
  }

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/workouts/");
        const data = await response.json();

        setWorkouts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchWorkouts();
  }, [])

  const submitAddModal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/workouts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        throw new Error("Failed to create workout");
      }

      const data = await response.json();
      setWorkouts((prev) => (prev ? [data, ...prev] : [data]))
      clearForm();
      closeModal();

    } catch (error) {
      console.error(error)
    }
  }

  const clearForm = () => {
    setForm({
      title: "",
      load: 1,
      reps: 1
    })
  }
  const showAddModal = () => {
    if (modalAddRef.current) {
      modalAddRef.current?.showModal();
    }
  }
  const closeModal = () => {
    if (modalAddRef.current) {
      modalAddRef.current?.close()
    }
  }

  const deleteWorkout = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to delete workout");
      }

      console.log("workout deleted successfully!")
      setWorkouts((prev) => prev?.filter(p => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  const inputClassName: string = "input focus:border-black border-gray-400 bg-white placeholder:text-gray-400 text-black w-full mt-1"
  return (
    <div className='min-h-screen grid justify-center bg-blue-50 '>
      {/**
       * Modal
       */}
      <div className='mt-20 w-full'>
        <div>
          <div className='flex justify-center items-center gap-1 text-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dumbbell-icon lucide-dumbbell text-primary size-10"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" /><path d="m2.5 21.5 1.4-1.4" /><path d="m20.1 3.9 1.4-1.4" /><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" /><path d="m9.6 14.4 4.8-4.8" /></svg>
            <h1 className='text-5xl font-bold text-black'>Fitness Tracker</h1>
          </div>
          <p className='text-gray-600 text-lg text-center'>Track your workouts with load and reps</p>
        </div>

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-center'>
          <div className='bg-white px-8 py-4 rounded-md ring-1 ring-inset ring-gray-200'>
            <h2 className='text-2xl font-bold text-blue-500'>2</h2>
            <p className='text-gray-600'>Total Exercise</p>
          </div>
          <div className='bg-white px-8 py-4 rounded-md ring-1 ring-inset ring-gray-200'>
            <h2 className='text-2xl font-bold text-green-500'>2</h2>
            <p className='text-gray-600'>Total Volume (lbs x reps)</p>
          </div>
          <div className='bg-white px-8 py-4 rounded-md ring-1 ring-inset ring-gray-200'>
            <h2 className='text-2xl font-bold text-purple-500'>2</h2>
            <p className='text-gray-600'>Avg Volume per Exercise</p>
          </div>
        </div>

        <div className='mt-6'>
          <button onClick={showAddModal} className='btn btn-primary cursor-pointer flex justify-center  items-center gap-1   text-white p-2 rounded-md w-full lg:w-48 font-medium '>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Workout
          </button>
        </div>
        <dialog ref={modalAddRef} className="modal ">
          <div className="modal-box bg-white">
            <form onSubmit={submitAddModal} method="dialog">
              <h3 className='text-black font-medium text-xl'>Add New Workout</h3>
              <div className='mt-4'>
                <label htmlFor="title" className='font-medium text-black'>Title</label>
                <input type="text" name="title" id="title" value={form.title} onChange={handleInputChange} placeholder='Enter Title' className={inputClassName} />
              </div>
              <div className='mt-2 flex w-full gap-3'>
                <div className='w-full'>
                  <label htmlFor="load" className='font-medium text-black'>Load (lbs)</label>
                  <input type="number" name="load" id="load" value={form.load} onChange={handleInputChange} placeholder='Enter Load' className={inputClassName} min={1} />
                </div>
                <div className='w-full'>
                  <label htmlFor="reps" className='font-medium text-black'>Reps</label>
                  <input type="number" name="reps" id="reps" value={form.reps} onChange={handleInputChange} placeholder='Enter Reps' className={inputClassName} min={1} />
                </div>
              </div>
              <div className='flex mt-4 gap-2'>
                <button type='submit' className='btn btn-primary grow-1'>Add Workout</button>
                <button type='button' onClick={closeModal} className="btn bg-transparent text-black shadow-none">Cancel</button>
              </div>
            </form>
          </div>
        </dialog>
        <div className='mt-6'>
          {workouts && workouts?.map((workout) => (
            <div key={workout._id} className='bg-white mb-4 px-8 py-6 rounded-md'>
              <div className='flex justify-between'>
                <h1 className='text-xl font-medium text-black'>{workout.title}</h1>
                <div className='flex items-center gap-2'>
                  <button className='p-2 hover:bg-gray-200 transition-all ease-in-out rounded-md cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-black">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button className='p-2 hover:bg-gray-200 transition-all ease-in-out text-red-500  rounded-md cursor-pointer' onClick={() => workout._id && deleteWorkout(workout._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className='flex justify-between items-center pt-4 '>
                <div className='flex gap-6 text-center'>
                  <div>
                    <h3 className='text-2xl text-blue-500 font-bold'>{workout.load}</h3>
                    <p className='text-gray-600'>lbs</p>
                  </div>
                  <div>
                    <h3 className='text-2xl text-green-500 font-bold'>{workout.reps}</h3>
                    <p className='text-gray-600'>reps</p>
                  </div>
                  <div>
                    <h3 className='text-2xl text-purple-500 font-bold'>{volume}</h3>
                    <p className='text-gray-600'>volume</p>
                  </div>
                </div>
                <div>
                  <span className='font-medium px-3 bg-gray-100 rounded-full text-sm text-black'>{workout.createdAt && new Date(workout.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
