import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import TopNav from './templates/TopNav';
import DropDown from './templates/DropDown';
import Shimmer from './templates/Shimmer';

const People = () => {
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);
    const [category, setCategory] = useState("popular");

    document.title = "KV | People";

    const getPeople = async (reset = false, selectedCategory = category, selectedPage = page) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const { data } = await axios.get(`/person/${selectedCategory}?page=${selectedPage}`);
            const results = data.results || [];
            console.log(results);
            setPeople(prev => {
                const newData = reset ? results : [...prev, ...results];
                return Array.from(new Map(newData.map(item => [item.id, item])).values());
            });

            if (results.length === 0) setHasMore(false);
        } catch (err) {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPeople([]);
        setPage(1);
        setHasMore(true);
        getPeople(true, category, 1);
    }, [category]);

    useEffect(() => {
        if (page > 1) {
            getPeople(false, category, page);
        }
    }, [page]);

    useEffect(() => {
        let timeout;
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    setPage(prevPage => prevPage + 1);
                }, 500);
            }
            setShowTopButton(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="py-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
            <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
                <h1 className="font-bold text-zinc-400 text-2xl flex items-center gap-3 pb-2">
                    <i
                        onClick={() => navigate(-1)}
                        className="hover:text-green-500 hover:shadow-[0_0_10px_#32CD32] transition-all duration-300 text-2xl cursor-pointer ri-arrow-left-line"
                    ></i>
                    People <small className='text-sm select-none text-zinc-600'>({category})</small>
                </h1>
            </div>

            <div className="w-full mb-6 px-4 sm:px-6">
                <TopNav />
            </div>

            <div className="w-full flex flex-wrap items-center mb-6 px-4 sm:px-6">
                <DropDown
                    title="Category"
                    options={["popular", "top_rated", "upcoming", "now_playing"]}
                    func={(selected) => {
                        setCategory(selected);
                        setPeople([]);
                        setPage(1);
                        setHasMore(true);
                        getPeople(true, selected, 1);
                    }}
                />
            </div>

            <div className="flex flex-wrap justify-center gap-8 items-center px-4 sm:px-6 w-full">
    {people.length === 0 && loading ? (
        <Shimmer />
    ) : (
        people.map(item => {
            return (
                <Link key={item.id} to={`/person/${item.id}`} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                    <div className="bg-[#2c2c2c] rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                        <img
                            src={item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                            alt={item.name}
                            className="w-full h-64 object-cover rounded-t-xl"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/500x750?text=No+Image'} // Fallback image on error
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-300">{item.name}</h2>
                            <p className="text-gray-400">{item.gender === 1 ? 'Female' : 'Male'}</p>
                            
                            {item.known_for && item.known_for.length > 0 ? (
                                <div className="text-gray-400 text-sm mt-2 flex flex-wrap items-center">
                                    <span className="text-gray-500">Known For:</span>
                                    {/* Truncate the known_for title to 5 characters with a fallback */}
                                    <p className="ml-2">
                                        {item.known_for[0].original_title && item.known_for[0].original_title.length > 5
                                            ? item.known_for[0].original_title.slice(0, 5) + '...'
                                            : item.known_for[0].original_title || 'No Title Available'}
                                    </p>
                                    <span className="ml-2 text-green-500">...more</span>
                                </div>
                            ) : (
                                <div className="text-gray-400 text-sm mt-2">
                                    <span className="text-gray-500">Known For:</span>
                                    <p className="ml-2 text-gray-600">No information available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            );
        })
    )}
</div>


            {loading && (
                <div className="text-center py-4 text-green-300">
                    <i className="ri-loader-4-line animate-spin text-xl"></i> Loading more...
                </div>
            )}

            {showTopButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-green-500/50 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
                >
                    <i className="ri-arrow-up-s-line text-xl"></i>
                </button>
            )}
        </div>
    );
};

export default People;
