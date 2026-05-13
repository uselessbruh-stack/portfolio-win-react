import React, { useState, useEffect } from 'react';
import './Photos.css';

const Photos = () => {
  const [view, setView] = useState('all'); // 'all', 'camera', 'favorites'
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Sample photos from Unsplash
  const samplePhotos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Mountain Landscape', type: 'sample' },
    { id: 2, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', title: 'Nature Scene', type: 'sample' },
    { id: 3, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', title: 'Sunset', type: 'sample' },
    { id: 4, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', title: 'Forest Path', type: 'sample' },
    { id: 5, url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800', title: 'Lake View', type: 'sample' },
    { id: 6, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800', title: 'Ocean Waves', type: 'sample' },
    { id: 7, url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800', title: 'Mountain Peak', type: 'sample' },
    { id: 8, url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', title: 'Tropical Beach', type: 'sample' },
    { id: 9, url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800', title: 'City Skyline', type: 'sample' },
  ];

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    // Load captured photos from localStorage
    const capturedPhotos = JSON.parse(localStorage.getItem('capturedPhotos') || '[]');
    const formattedCaptured = capturedPhotos.map(photo => ({
      id: photo.id,
      url: photo.data,
      title: `Photo ${new Date(photo.timestamp).toLocaleString()}`,
      type: 'camera',
      timestamp: photo.timestamp
    }));

    // Combine sample photos and captured photos
    setPhotos([...formattedCaptured, ...samplePhotos]);
  };

  const getFilteredPhotos = () => {
    if (view === 'camera') {
      return photos.filter(p => p.type === 'camera');
    } else if (view === 'all') {
      return photos;
    } else if (view === 'favorites') {
      return photos.filter(p => p.type === 'sample').slice(0, 3);
    }
    return photos;
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;

      if (e.key === 'ArrowLeft') {
        navigatePhoto('prev');
      } else if (e.key === 'ArrowRight') {
        navigatePhoto('next');
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  const navigatePhoto = (direction) => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredPhotos.length;
    } else {
      newIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    }

    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const downloadPhoto = (photo) => {
    const link = document.createElement('a');
    link.download = `${photo.title.replace(/\s+/g, '_')}.jpg`;
    link.href = photo.url;
    link.click();
  };

  const filteredPhotos = getFilteredPhotos();

  return (
    <div className="photos-container">
      <div className="photos-sidebar">
        <div
          className={`photos-nav-item ${view === 'all' ? 'active' : ''}`}
          onClick={() => setView('all')}
        >
          🖼️ All Photos ({photos.length})
        </div>
        <div
          className={`photos-nav-item ${view === 'camera' ? 'active' : ''}`}
          onClick={() => setView('camera')}
        >
          📸 Camera Roll ({photos.filter(p => p.type === 'camera').length})
        </div>
        <div
          className={`photos-nav-item ${view === 'favorites' ? 'active' : ''}`}
          onClick={() => setView('favorites')}
        >
          ⭐ Favorites
        </div>
      </div>

      <div className="photos-main">
        <div className="photos-grid">
          {filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="photo-item"
                onClick={() => openLightbox(photo)}
              >
                <img src={photo.url} alt={photo.title} loading="lazy" />
                <div className="photo-item-info">{photo.title}</div>
              </div>
            ))
          ) : (
            <div className="photos-empty">
              {view === 'camera'
                ? '📸 No photos captured yet.\n\nTake some photos with the Camera app!'
                : view === 'favorites'
                  ? '⭐ No favorite photos'
                  : '🖼️ No photos in library'}
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div className="photo-lightbox active" onClick={closeLightbox}>
          <img src={selectedPhoto.url} alt={selectedPhoto.title} />
          <button className="photo-lightbox-close" onClick={closeLightbox}>✕</button>
          <button
            className="photo-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto('prev');
            }}
          >
            ◀
          </button>
          <button
            className="photo-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto('next');
            }}
          >
            ▶
          </button>
          <button
            className="photo-lightbox-download"
            onClick={(e) => {
              e.stopPropagation();
              downloadPhoto(selectedPhoto);
            }}
          >
            💾 Download
          </button>
          <div className="photo-lightbox-title">{selectedPhoto.title}</div>
        </div>
      )}
    </div>
  );
};

export default Photos;
