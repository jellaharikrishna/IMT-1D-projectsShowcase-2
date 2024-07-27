import {Component} from 'react'

import Loader from 'react-loader-spinner'
import ProjectsList from './components/ProjectsList'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    activeId: categoriesList[0].id,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    const {activeId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelectOption = event => {
    this.setState(
      {activeId: event.target.value},
      this.getProjects,
    )
  }

  loaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height="50" width="50" />
    </div>
  )

  successView = () => {
    const {projectsList} = this.state
    return (
      <ul className="list-container">
        {projectsList.map(each => (
          <ProjectsList key={each.id} projectListDetails={each} />
        ))}
      </ul>
    )
  }

  onClickRetry = () => {
    this.getProjects()
  }

  failureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-retry-btn"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderApi = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.loaderView()
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    console.log(activeId)

    return (
      <div className="app-container">
        <nav className="navbar-container">
          <img
            className="website-logo-image"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>

        <select
          value={activeId}
          className="select-card"
          onChange={this.onChangeSelectOption}
        >
          {categoriesList.map(each => (
            <option value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>

        <div className="content-container">{this.renderApi()}</div>
      </div>
    )
  }
}

export default App

/*

console.log((event.target.value).toUpperCase())
*/
