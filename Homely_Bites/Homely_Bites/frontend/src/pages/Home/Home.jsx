import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload.jsx/AppDownload'
import HomeChefCard from '../../components/HomeChefCard/HomeChefCard_Search'
import { StoreContext } from '../../context/StoreContext'

const Home = () => {
    const navigate = useNavigate()
    const { url, token } = useContext(StoreContext)
    
    const [category, setCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([])
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState(null)

    // Debounce search query (300ms delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Search HomeChefs when debounced query changes
    useEffect(() => {
        if (debouncedSearchQuery.trim() === "") {
            setIsSearchMode(false)
            setSearchResults([])
            setSearchError(null)
            return
        }

        searchHomeChefs(debouncedSearchQuery)
    }, [debouncedSearchQuery])

    const searchHomeChefs = async (query) => {
        try {
            setSearchLoading(true)
            setSearchError(null)
            setIsSearchMode(true)

            const response = await fetch(`${url}/homechef/search/business?query=${encodeURIComponent(query.trim())}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if (data.status === 'success') {
                setSearchResults(data.data || [])
                if (data.data && data.data.length === 0) {
                    setSearchError('No kitchens found matching your search')
                }
            } else {
                setSearchError(data.message || 'Error searching kitchens')
                setSearchResults([])
            }
        } catch (err) {
            console.error('Error searching chefs:', err)
            setSearchError('Failed to search kitchens. Please try again.')
            setSearchResults([])
        } finally {
            setSearchLoading(false)
        }
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setIsSearchMode(false)
        setSearchResults([])
        setSearchError(null)
    };

    const handleViewKitchen = (chefId) => {
        navigate(`/customer/kitchen/${chefId}`)
    }

    return (
        <div>
            <Header/>
            
            {/* Search Bar */}
            <div className='chef-search-container'>
                <div className='search-input-wrapper'>
                    <input
                        type='text'
                        className='chef-search-input'
                        placeholder='Search by chef name or kitchen'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {searchQuery && (
                        <button className='clear-btn' onClick={handleClearSearch}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Search Results Section */}
            {isSearchMode && (
                <div className='search-results-section'>
                    {searchLoading ? (
                        <div className='search-loading'>
                            <p>Searching kitchens...</p>
                        </div>
                    ) : searchError ? (
                        <div className='search-error'>
                            <p>⚠️ {searchError}</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className='search-results-container'>
                            <h2>Available Kitchens</h2>
                            <div className='search-results-grid'>
                                {searchResults.map((chef) => (
                                    <HomeChefCard
                                        key={chef.chef_id}
                                        chef={chef}
                                        onViewMenu={handleViewKitchen}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Regular Food Display - Only show if not in search mode */}
            {!isSearchMode && (
                <>
                    <ExploreMenu category={category} setCategory={setCategory}/>
                    <FoodDisplay category={category} searchQuery=""/>
                </>
            )}

            <AppDownload/>
        </div>
    )
}

export default Home
