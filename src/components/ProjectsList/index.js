import './index.css'

const ProjectsList = props => {
  const {projectListDetails} = props
  const {name, imageUrl} = projectListDetails

  return (
    <li className="list-card">
      <img className="project-image" src={imageUrl} alt={name} />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectsList
