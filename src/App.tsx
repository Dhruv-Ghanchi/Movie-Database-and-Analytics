// ES6 Feature: Import statements with destructuring
import { useState, useEffect } from 'react';
import { Film, TrendingUp, BarChart3, Search as SearchIcon, X, Star, Calendar, DollarSign, Clock } from 'lucide-react';
// Import Recharts components for data visualization
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

// TypeScript interfaces for type safety
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  budget?: number;
  revenue?: number;
}

// ES6 Feature: Arrow function component with TypeScript
const App = () => {
  // React Hooks: useState for state management
  const [activeTab, setActiveTab] = useState<'search' | 'trending' | 'analytics'>('trending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // TMDB API Configuration
  const API_KEY = '8265bd1679663a7ea12ac168da84d2e8';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  // Genre mapping for data visualization
  const GENRE_MAP: { [key: number]: string } = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western'
  };

  // React Hook: useEffect to fetch trending movies on component mount
  useEffect(() => {
    // ES6 Feature: Arrow function with async/await
    const fetchTrending = async () => {
      setLoading(true);
      try {
        // ES6 Feature: Template literals for dynamic URL construction
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        // ES6 Feature: Array method - slice to get top 12 movies
        setTrendingMovies(data.results.slice(0, 12));
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []); // Empty dependency array means this runs once on mount

  // ES6 Feature: Async/await function for searching movies
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // ES6 Feature: Template literals with embedded expressions
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // ES6 Feature: Async/await function to fetch detailed movie information
  const fetchMovieDetails = async (movieId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
      const data = await response.json();
      setSelectedMovie(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  // ES6 Feature: Arrow function for preparing chart data
  // Data processing for Pie Chart - Genre Distribution
  const getGenreData = () => {
    const genreCounts: { [key: string]: number } = {};

    // ES6 Feature: forEach method for array iteration
    trendingMovies.forEach((movie) => {
      // ES6 Feature: Optional chaining and forEach
      movie.genre_ids?.forEach((genreId) => {
        const genreName = GENRE_MAP[genreId] || 'Other';
        genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
      });
    });

    // ES6 Feature: Object.entries, map, and object destructuring
    return Object.entries(genreCounts).map(([name, value]) => ({ name, value }));
  };

  // Data processing for Bar Chart - Ratings Comparison
  const getRatingsData = () => {
    // ES6 Feature: Array methods - slice, map with destructuring
    return trendingMovies.slice(0, 8).map((movie) => ({
      // ES6 Feature: Object shorthand property names
      title: movie.title.length > 15 ? `${movie.title.slice(0, 15)}...` : movie.title,
      rating: Number(movie.vote_average.toFixed(1))
    }));
  };

  // Data processing for Line Chart - Vote Count Analysis
  const getVotesData = () => {
    // ES6 Feature: Array method - map with arrow function
    return trendingMovies.slice(0, 8).map((movie, index) => ({
      rank: `#${index + 1}`,
      votes: movie.vote_count
    }));
  };

  // Calculate statistics for Analytics Dashboard
  const calculateStats = () => {
    // ES6 Feature: Array method - reduce for aggregation
    const totalVotes = trendingMovies.reduce((sum, movie) => sum + movie.vote_count, 0);
    const avgRating = trendingMovies.reduce((sum, movie) => sum + movie.vote_average, 0) / trendingMovies.length;
    // ES6 Feature: Spread operator with Math.max
    const highestRating = Math.max(...trendingMovies.map(m => m.vote_average));

    return {
      avgRating: avgRating.toFixed(1),
      totalVotes: totalVotes.toLocaleString(),
      highestRating: highestRating.toFixed(1)
    };
  };

  // ES6 Feature: Object destructuring
  const stats = calculateStats();
  const genreData = getGenreData();
  const ratingsData = getRatingsData();
  const votesData = getVotesData();

  // Colors for charts
  const CHART_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];

  return (
    <div className="app-container">
      {/* Navigation Bar - Bootstrap navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <div className="navbar-brand">
            <Film size={32} className="me-2" />
            <span className="fs-3 fw-bold">CineScope</span>
          </div>
          <div className="navbar-nav ms-auto">
            {/* ES6 Feature: Arrow functions in event handlers */}
            <button
              className={`nav-btn ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              <TrendingUp size={20} className="me-2" />
              Trending
            </button>
            <button
              className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <SearchIcon size={20} className="me-2" />
              Search
            </button>
            <button
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={20} className="me-2" />
              Analytics
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container-fluid py-5">
        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="tab-content">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-white mb-3">Search Movies</h1>
              <p className="lead text-white-50">Discover your favorite movies from our extensive database</p>
            </div>

            {/* Bootstrap input group for search */}
            <div className="row justify-content-center mb-5">
              <div className="col-lg-6 col-md-8">
                <div className="input-group input-group-lg glass-card p-2">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search for movies..."
                    value={searchQuery}
                    // ES6 Feature: Arrow function with destructuring
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button className="btn btn-primary px-4" onClick={handleSearch}>
                    <SearchIcon size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {/* Search Results Grid - Bootstrap grid system */}
            {!loading && searchResults.length > 0 && (
              <div className="row g-4">
                {/* ES6 Feature: Array map method to render list */}
                {searchResults.map((movie) => (
                  <div key={movie.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div
                      className="movie-card glass-card"
                      onClick={() => fetchMovieDetails(movie.id)}
                    >
                      <div className="movie-poster">
                        {movie.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            className="img-fluid"
                          />
                        ) : (
                          <div className="no-poster">
                            <Film size={64} />
                          </div>
                        )}
                      </div>
                      <div className="movie-info p-3">
                        <h5 className="movie-title">{movie.title}</h5>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="badge bg-warning text-dark">
                            <Star size={14} className="me-1" />
                            {movie.vote_average.toFixed(1)}
                          </span>
                          {/* ES6 Feature: Optional chaining */}
                          <span className="text-white-50 small">
                            {movie.release_date?.split('-')[0] || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRENDING TAB */}
        {activeTab === 'trending' && (
          <div className="tab-content">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-white mb-3">Trending This Week</h1>
              <p className="lead text-white-50">Top 12 movies everyone is watching right now</p>
            </div>

            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {!loading && (
              <div className="row g-4">
                {/* ES6 Feature: Array map with index parameter */}
                {trendingMovies.map((movie, index) => (
                  <div key={movie.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div
                      className="movie-card glass-card position-relative"
                      onClick={() => fetchMovieDetails(movie.id)}
                    >
                      {/* Ranking Badge */}
                      <div className="ranking-badge">#{index + 1}</div>
                      <div className="movie-poster">
                        {movie.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            className="img-fluid"
                          />
                        ) : (
                          <div className="no-poster">
                            <Film size={64} />
                          </div>
                        )}
                      </div>
                      <div className="movie-info p-3">
                        <h5 className="movie-title">{movie.title}</h5>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="badge bg-warning text-dark">
                            <Star size={14} className="me-1" />
                            {movie.vote_average.toFixed(1)}
                          </span>
                          <span className="text-white-50 small">
                            {movie.vote_count.toLocaleString()} votes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB - DATA VISUALIZATION */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-white mb-3">Movie Analytics</h1>
              <p className="lead text-white-50">Comprehensive data analysis of trending movies</p>
            </div>

            {/* Statistics Cards - Bootstrap cards */}
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="stats-card glass-card text-center p-4">
                  <div className="stats-icon mb-3">
                    <Star size={48} />
                  </div>
                  <h3 className="stats-value">{stats.avgRating}</h3>
                  <p className="stats-label">Average Rating</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stats-card glass-card text-center p-4">
                  <div className="stats-icon mb-3">
                    <TrendingUp size={48} />
                  </div>
                  <h3 className="stats-value">{stats.totalVotes}</h3>
                  <p className="stats-label">Total Votes</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stats-card glass-card text-center p-4">
                  <div className="stats-icon mb-3">
                    <Film size={48} />
                  </div>
                  <h3 className="stats-value">{stats.highestRating}</h3>
                  <p className="stats-label">Highest Rating</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="row g-4">
              {/* PIE CHART - Genre Distribution */}
              <div className="col-lg-4">
                <div className="chart-card glass-card p-4">
                  <h4 className="chart-title text-center mb-4">Genre Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {/* ES6 Feature: Array map with index */}
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BAR CHART - Ratings Comparison */}
              <div className="col-lg-8">
                <div className="chart-card glass-card p-4">
                  <h4 className="chart-title text-center mb-4">Top Movies - Ratings Comparison</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ratingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="title" stroke="#fff" />
                      <YAxis stroke="#fff" domain={[0, 10]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #444' }}
                      />
                      <Legend />
                      <Bar dataKey="rating" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* LINE CHART - Vote Count Analysis */}
              <div className="col-12">
                <div className="chart-card glass-card p-4">
                  <h4 className="chart-title text-center mb-4">Vote Count Trend - Top 8 Movies</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={votesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="rank" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #444' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="votes"
                        stroke="#ec4899"
                        strokeWidth={3}
                        dot={{ fill: '#ec4899', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOVIE DETAILS MODAL - Bootstrap modal */}
      {showModal && selectedMovie && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content glass-card">
              <div className="modal-header border-0">
                <h3 className="modal-title text-white">{selectedMovie.title}</h3>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    {selectedMovie.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${selectedMovie.poster_path}`}
                        alt={selectedMovie.title}
                        className="img-fluid rounded shadow-lg"
                      />
                    ) : (
                      <div className="no-poster" style={{ height: '400px' }}>
                        <Film size={100} />
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <span className="badge bg-warning text-dark me-2 fs-6">
                        <Star size={18} className="me-1" />
                        {selectedMovie.vote_average.toFixed(1)} / 10
                      </span>
                      <span className="text-white-50">
                        ({selectedMovie.vote_count.toLocaleString()} votes)
                      </span>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-white-50 mb-2">Overview</h6>
                      <p className="text-white">{selectedMovie.overview || 'No overview available'}</p>
                    </div>

                    <div className="row g-3">
                      <div className="col-6">
                        <div className="detail-item">
                          <Calendar size={20} className="me-2 text-primary" />
                          <div>
                            <small className="text-white-50 d-block">Release Date</small>
                            <span className="text-white">{selectedMovie.release_date || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      {selectedMovie.runtime && (
                        <div className="col-6">
                          <div className="detail-item">
                            <Clock size={20} className="me-2 text-success" />
                            <div>
                              <small className="text-white-50 d-block">Runtime</small>
                              <span className="text-white">{selectedMovie.runtime} min</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedMovie.budget && selectedMovie.budget > 0 && (
                        <div className="col-6">
                          <div className="detail-item">
                            <DollarSign size={20} className="me-2 text-warning" />
                            <div>
                              <small className="text-white-50 d-block">Budget</small>
                              <span className="text-white">${(selectedMovie.budget / 1000000).toFixed(1)}M</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedMovie.revenue && selectedMovie.revenue > 0 && (
                        <div className="col-6">
                          <div className="detail-item">
                            <DollarSign size={20} className="me-2 text-danger" />
                            <div>
                              <small className="text-white-50 d-block">Revenue</small>
                              <span className="text-white">${(selectedMovie.revenue / 1000000).toFixed(1)}M</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ES6 Feature: Optional chaining and array length check */}
                    {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                      <div className="mt-4">
                        <h6 className="text-white-50 mb-2">Genres</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {/* ES6 Feature: Array map method */}
                          {selectedMovie.genres.map((genre) => (
                            <span key={genre.id} className="badge bg-primary">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ES6 Feature: Default export
export default App;
