// components/Homepage.js
import React from 'react';
import ContactUs from './ContactUs.tsx';
import About from './About.tsx';

const Home = () => {
    return (
        <main className="">
            <section className="relative bg-cover bg-center" style={{ backgroundImage: `url('./images/rangamati.jpg')`, height: "60vh" }}>
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" >
                    <div className="text-white ms-8 mt-48 md:ms-52">
                        <h1 className="text-3xl font-bold mb-4 text-white">Welcome to TripBlaze</h1>
                        <p className="text-lg">Plan your dream trip with us!</p>
                    </div>
                </div>
            </section>

            {/* aboud us section */}
            <About />

            {/* why chose us section */}
            <div className="mx-auto p-12 bg-green-400">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Why Choose Trip-Blaze
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">Highest Quality</h3>
                        <p className="text-gray-700">
                            390+ reviews & 5/5 rating on TripAdvisor. Awarded Certificate of
                            Excellence in 2015, 2016, 2017, 2018 & 2019, Hall of Fame in 2019,
                            and Travelers' Choice in 2020 & 2023 by TripAdvisor.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">Lower Price</h3>
                        <p className="text-gray-700">
                            Compared to the foreign operators. As you are booking directly, we
                            don't need to pay any foreign operator a hefty commission. So our
                            tours are an excellent value for money.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">COVID-19 Protection</h3>
                        <p className="text-gray-700">
                            Free cancellation and date change options if your country or
                            Bangladesh is under lockdown or Bangladesh enters the Red List of
                            your country. No fear of losing your money.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">Tiny Groups</h3>
                        <p className="text-gray-700">
                            1-12 Travelers per group maximum. Join any group and meet some
                            like-minded travelers from around the world. Private tours are also
                            available for a group of just 1 traveler.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">Scheduled Tours</h3>
                        <p className="text-gray-700">
                            Regularly scheduled tours year-round. Suitable for solo travelers.
                            Reduce cost by sharing rooms with total same-sex strangers or book
                            a Single Supplement for separate rooms.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">Local Business</h3>
                        <p className="text-gray-700">
                            We are a home-grown local small business. 100% of your money goes
                            to the locals. You support a local small business by booking
                            directly with us and making local tourism sustainable.
                        </p>
                    </div>
                </div>
            </div>

            <ContactUs />
        </main>
    );
};

export default Home;