interface WorkoutType {
    _id?: string
    title: string;
    reps: number;
    load: number;
    createdAt?: string
}
interface WorkoutProps {
    workout: WorkoutType;
    onShowUpdateModal: (workout: WorkoutType) => void;
    onShowDeleteModal: (id: string) => void;
}
const Workout = ({ workout, onShowUpdateModal, onShowDeleteModal }: WorkoutProps) => {
    return (
        <div key={workout._id} className='bg-white mb-4 px-8 py-6 rounded-md'>
            <div className='flex justify-between'>
                <h1 className='text-xl font-medium text-black'>{workout.title}</h1>
                <div className='flex items-center gap-2'>
                    <button onClick={() => onShowUpdateModal(workout)} className='p-2 hover:bg-gray-200 transition-all ease-in-out rounded-md cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </button>
                    <button className='p-2 hover:bg-gray-200 transition-all ease-in-out text-red-500  rounded-md cursor-pointer' onClick={() => workout._id && onShowDeleteModal(workout._id)}>
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
                        <h3 className='text-2xl text-purple-500 font-bold'>{workout.reps * workout.load}</h3>
                        <p className='text-gray-600'>volume</p>
                    </div>
                </div>
                <div>
                    <span className='font-medium px-3 bg-gray-100 rounded-full text-sm text-black'>{workout.createdAt && new Date(workout.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    )
}

export default Workout