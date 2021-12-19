function RepoDetails({ stats, loading }) {
    if (loading) {
        return (
            <h1 className="loader">Loading...</h1>
        )
    }
    return (
        <div className="repo-details-container">
            <div className="details-row">
                <label className="label">Total Public Repos:</label>
                <span className="value">{stats.public_repos}</span>
            </div>
        </div>
    );
}

export default RepoDetails;