import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Modal from "../Modal.tsx";

const RoomCart = ({ id, title, src, occupancy, roomCharacteristics, roomSize, facilities, price, hotel }) => {
    const { handleBooking } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <div className="flex flex-col lg:flex-row gap-8">
                <img src={process.env.REACT_APP_server_path + src} alt="" className='w-98 lg:max-w-md' />
                <div className="">
                    <h2 className="text-lg font-bold mb-4">{title}</h2>
                    <p className="text-md"><span className='font-semibold'>Size: </span>{roomSize}</p>
                    <p className="text-md"><span className='font-semibold'>Occupancy: </span> <br />{occupancy}</p>
                    <p className="text-md"><span className='font-semibold'>Characteristics: </span> <br />{roomCharacteristics}</p>
                    <p className="text-md"><span className='font-semibold'>Facilities: </span> <br />{facilities}</p>
                    <p className="text-md"><span className='font-semibold'>Price: </span> {price} USD</p>
                    <div className="flex gap-3">
                        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={() => setModalOpen(true)}>Book Now</button>
                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => setModalOpen(false)}
                            title={`Booking ${title} Room`}
                        >
                            <form onSubmit={e => {
                                e.preventDefault();
                                const formdata = {}
                                formdata.hotelTitle = hotel.title;
                                formdata.hotelId = hotel.id;
                                formdata.roomId = id;
                                formdata.date = e.target.date.value;
                                formdata.bookingType = "hotel";
                                formdata.price = price;
                                formdata.title = title;
                                formdata.size = roomSize;
                                if (new Date(formdata.date) <= new Date()) {
                                    alert('Invalid date');
                                } else {
                                    handleBooking(formdata).then(() => setModalOpen(false));
                                }
                            }}
                                className='flex flex-col space-y-2'
                            >
                                <input required type="date" name="date" id="date" className='border border-1 p-2 me-2' />
                                <button className="bg-green-500 px-4 py-2 text-white">Book</button>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomCart;