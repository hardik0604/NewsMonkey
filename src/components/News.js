import React, {useEffect, useState} from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [nextPage, setNextPage] = useState(null)
    const [pageHistory, setPageHistory] = useState([null])
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const appLogo = `${process.env.PUBLIC_URL}/logo.png`;
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const buildNewsDataUrl = (pageToken = null) => {
        const params = new URLSearchParams({
            apikey: props.apiKey,
            country: props.country,
            q: props.category || 'news'
        });
        if (props.language) {
            params.append('language', props.language);
        }
        if (pageToken) {
            // NOTE: The NewsData.io API uses 'page' parameter for the next_page token value, 
            // so using 'page' here is correct for this API.
            params.append('page', pageToken); 
        }
        return `https://newsdata.io/api/1/news?${params.toString()}`;
    }

    const fetchPage = async (pageToken = null, onSuccess) => {
        props.setProgress(10);
        const url = buildNewsDataUrl(pageToken);
        setLoading(true)
        setErrorMessage(null)
        try {
            let data = await fetch(url);
            props.setProgress(30);
            if (!data.ok) {
                // Read error message from body if available
                const errorBody = await data.json().catch(() => ({}));
                const message = errorBody.results?.message || `Unable to load news (status ${data.status})`;
                throw new Error(message);
            }
            let parsedData = await data.json()
            props.setProgress(70);
            setArticles(parsedData.results || [])
            setNextPage(parsedData.nextPage || null)
            if (typeof onSuccess === 'function') {
                onSuccess(parsedData);
            }
        } catch (error) {
            setArticles([])
            setNextPage(null)
            setErrorMessage(error.message || 'Unable to load news at the moment.')
        } finally {
            setLoading(false)
            props.setProgress(100);
        }
    }

    const resetAndFetch = () => {
        setPageHistory([null]);
        setCurrentPageIndex(0);
        fetchPage(null);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        resetAndFetch(); 
        // eslint-disable-next-line
    }, [props.category, props.country, props.language]) // Added props to dependency array for better practice

    const handleNextPage = () => {
        if (!nextPage || loading) {
            return;
        }
        fetchPage(nextPage, () => {
            setPageHistory((prevHistory) => {
                const trimmedHistory = prevHistory.slice(0, currentPageIndex + 1);
                trimmedHistory.push(nextPage);
                return trimmedHistory;
            });
            setCurrentPageIndex((prevIndex) => prevIndex + 1);
        });
    };

    const handlePreviousPage = () => {
        if (currentPageIndex === 0 || loading) {
            return;
        }
        const targetToken = pageHistory[currentPageIndex - 1] ?? null;
        fetchPage(targetToken, () => {
            setCurrentPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        });
    };
 
    return (
        // Apply retro-font and background classes to the main container
        <div className="retro-app-container">
            {/* RETRO HEADLINE */}
            <div className="headline-banner text-center">
                <img 
                    src={appLogo} 
                    alt="NewsMonkey logo" 
                    className="news-logo"
                />
                <h1 
                    className="retro-text-amber headline-title"
                >
                    SYSTEM_LOG: Top {capitalizeFirstLetter(props.category)} Headlines
                </h1>
            </div>
            
            {/* Displaying Loading Spinner */}
            {loading && <Spinner />}

            {/* ERROR MESSAGE (Styling the Bootstrap Alert) */}
            {errorMessage && !loading && (
                <div 
                    className="alert retro-alert-danger text-center" 
                    role="alert"
                    style={{ 
                        margin: '20px auto', 
                        width: 'fit-content',
                        border: '2px dashed #ffb700', // Amber dashed border
                        backgroundColor: 'black',
                        color: '#ffb700',
                        textShadow: '0 0 3px #ffb700'
                    }}
                >
                    &gt;&gt; FATAL_ERROR: {errorMessage}
                </div>
            )}

            <div className="container">
                <div className="row">
                    {/* Only display articles if there are no loading or serious errors preventing display */}
                    {(!loading || articles.length > 0) && articles.map((element) => {
                        const key = element.link || element.url || element.title;
                        return <div className="col-md-4" key={key}>
                            <NewsItem
                                title={element.title ? element.title : "[[NO TITLE DATA]]"}
                                description={element.description ? element.description.slice(0, 88) + "..." : "[[NO DESCRIPTION DATA]]"} // Limit description length
                                imageUrl={element.image_url || element.urlToImage}
                                newsUrl={element.link || element.url}
                                author={element.creator ? element.creator.join(', ') : element.author || "Unknown User"}
                                date={element.pubDate || element.publishedAt}
                                source={element.source_id || element.source?.name || "Unknown Source"}
                                // Pass retro-style props to NewsItem (assuming NewsItem is updated to use them)
                                retroStyle="amber" 
                            />
                        </div>
                    })}
                </div>
            </div> 

            <div 
                className="pagination-controls d-flex justify-content-between align-items-center retro-text-amber" 
                style={{ margin: '40px auto', maxWidth: '400px' }}
            >
                <button 
                    className="btn retro-amber-button"
                    disabled={currentPageIndex === 0 || loading}
                    onClick={handlePreviousPage}
                >
                    &lt; Prev
                </button>
                <span style={{ textShadow: '0 0 3px #ffb700' }}>
                    PAGE {currentPageIndex + 1}
                </span>
                <button 
                    className="btn retro-amber-button"
                    disabled={!nextPage || loading}
                    onClick={handleNextPage}
                >
                    Next &gt;
                </button>
            </div>
        </div>
    )
}


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
    language: 'en'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    language: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
    setProgress: PropTypes.func.isRequired,
}

export default News