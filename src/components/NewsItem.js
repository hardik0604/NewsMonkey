import React, { useEffect, useState } from 'react'
import placeholderImage from '../assets/default-news.svg';

const NewsItem = (props) => {
    let { title, description, imageUrl, newsUrl, author, date} = props;
    const [imageSrc, setImageSrc] = useState(imageUrl || placeholderImage);
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US') : "DATE_UNKNOWN";

    useEffect(() => {
        setImageSrc(imageUrl || placeholderImage);
    }, [imageUrl]);

    const handleImageError = () => {
        if (imageSrc !== placeholderImage) {
            setImageSrc(placeholderImage);
        }
    };
    
    // Define styles for the image to ensure consistent size and retro look
    const imageStyle = {
        // Set a fixed height for the image wrapper to maintain consistency
        height: '180px', 
        overflow: 'hidden',
        // Make the image fit nicely without stretching
        objectFit: 'cover' 
    };

    return (
        // The outer div remains for margin/padding, but we target the inner 'news-card' for height fix
        <div className="my-3">
            {/* 1. Main card wrapper changed to 'news-card' to enable equal height fix 
                2. Removed Bootstrap 'card' class to avoid modern styling conflicts
            */}
            <div className="news-card"> 
                
               

                {/* IMAGE */}
                <div style={imageStyle}>
                    <img 
                        src={imageSrc} 
                        className="card-img-top" 
                        alt="News article visual" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={handleImageError}
                    />
                </div>

                {/* CARD BODY */}
                <div className="card-body"> 
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    
                    {/* META-INFO (Author/Date) - Styled with retro font/color */}
                    <p className="card-text">
                        <small className="retro-text-amber retro-meta-info">
                            &gt; EXEC BY {!author ? "UNKNOWN_USER" : author} @ {formattedDate}
                        </small>
                    </p>
                    
                    {/* READ MORE BUTTON - Pushed to the bottom by flex-grow in card-body */}
                    <a 
                        rel="noreferrer" 
                        href={newsUrl} 
                        target="_blank" 
                        className="btn btn-sm retro-amber-button read-more-button" // Added retro class and the required 'read-more-button' class
                    >
                        [VIEW_FILE]
                    </a>
                </div>
            </div>
        </div>
    )
}
// Removed the 'new Date().toGMTString()' and used 'toLocaleDateString' for a cleaner retro timestamp

export default NewsItem