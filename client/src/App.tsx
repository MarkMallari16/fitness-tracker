import { useEffect, useRef, useState } from 'react';
import './App.css'
import { LucideDumbbell } from 'lucide-react';
import Workout from './components/Workout';

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

type FormModeType = "add" | "update";

function App() {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutType[] | undefined>(undefined);
  const [formMode, setFormMode] = useState<FormModeType>();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<WorkoutFormType>({
    title: "",
    load: 1,
    reps: 1
  });

  const totalExercise = workouts?.length ?? 0;
  const totalVolume = workouts?.reduce((sum, w) => sum + (w.load * w.reps), 0);
  const averageVolumePerExercise = totalVolume;

  //handle input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "load" || name === "reps" ? Number(value) : value,
    }));
  }

  //fetch data from backend
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/workouts/`);
        const data = await response.json();

        setWorkouts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchWorkouts();
  }, [])

  //for add and update form
  const submitAddModal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let response: Response;
      let data;

      if (formMode === "add") {
        response = await fetch("http://localhost:5000/api/workouts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        })

        if (!response.ok) {
          throw new Error("Failed to create workout");
        }
      } else {
        response = await fetch(`http://localhost:5000/api/workouts/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        })

        if (!response.ok) {
          throw new Error("Failed to create workout");
        }
      }

      //response to backend
      data = await response.json();

      if (formMode === "add") {
        //this will add workout first then previous workout if empty it will add only the data
        setWorkouts((prev) => (prev ? [data, ...prev] : [data]))
      } else {
        setWorkouts(prev =>
          //this will replace the updated data else it will keep the workout
          prev?.map(w => w._id === editingId ? data : w)
        )
      }
      clearForm();
      closeModal();
    } catch (error) {
      console.error(error)
    }
  }
  //clear the form
  const clearForm = () => {
    setForm({
      title: "",
      load: 1,
      reps: 1
    })
  }

  //add modal
  const showAddModal = () => {
    setFormMode("add");
    setEditingId(null);
    clearForm();
    if (modalRef.current) {
      modalRef.current?.showModal();
    }
  }

  //update modal
  const showUpdateModal = (workout: WorkoutType) => {
    setFormMode("update");
    setEditingId(workout._id ?? null);

    setForm({
      title: workout.title,
      load: workout.load,
      reps: workout.reps
    });

    if (modalRef.current) {
      modalRef.current.showModal();
    }

  }
  //close modal
  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current?.close()
    }
  }

  //delete workout
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

  //reuse class for input
  const inputClassName: string = "input focus:border-black border-gray-400 bg-white placeholder:text-gray-400 text-black w-full mt-1"

  return (
    <div className='min-h-screen grid justify-center bg-blue-50 '>
      {/**
       * Modal
       */}
      <div className='mt-20 w-full'>
        <div>
          <div className='flex justify-center items-center gap-1 text-center'>
            <LucideDumbbell className='text-primary' size={40} />

            <h1 className='text-5xl  text-black font-black'>Fitness Tracker</h1>
          </div>
          <p className='text-gray-600 text-lg text-center'>Track your workouts with load and reps</p>
        </div>

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-center'>
          <div className='bg-white px-8 py-4 rounded-md ring-1 ring-inset ring-gray-200'>
            <h2 className='text-2xl font-bold text-blue-500'>{totalExercise}</h2>
            <p className='text-gray-600'>Total Exercise</p>
          </div>
          <div className='bg-white px-8 py-4 rounded-md ring-1 ring-inset ring-gray-200'>
            <h2 className='text-2xl font-bold text-green-500'>{totalVolume}</h2>
            <p className='text-gray-600'>Total Volume (lbs x reps)</p>
          </div>
          <div className='bg-white px-8 py-4 rounded-md ring-1 ring-inset ring-gray-200'>
            <h2 className='text-2xl font-bold text-purple-500'>{averageVolumePerExercise}</h2>
            <p className='text-gray-600'>Avg Volume per Exercise</p>
          </div>
        </div>

        <div className='mt-6'>
          <button onClick={showAddModal} className='btn btn-primary cursor-pointer flex justify-center  items-center gap-1 text-white rounded-md w-full lg:w-48 font-medium '>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Workout
          </button>
        </div>

        <dialog ref={modalRef} className="modal ">
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
          {workouts && workouts.length > 0 ? workouts?.map((workout) => (
            <Workout workout={workout} onShowUpdateModal={showUpdateModal} onShowDeleteModal={deleteWorkout} />
          )) : (
            <div className='bg-white p-5 rounded-md'>
              <div className='flex flex-col justify-center items-center'>
                <LucideDumbbell className='mb-2 text-gray-400' size={80} />
                <h2 className='text-gray-500 font-medium'>No workouts yet</h2>
                <p className='text-gray-400 '>Add your first workout to get started!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
