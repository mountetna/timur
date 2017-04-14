const ManifestPreview = ({ name, project, updated_at, description, is_editable, user, access, handleClick }) => (
  <div className='manifest-preview'>
    <div>
      <a href='#' onClick={handleClick}>
        <span className='name'>{name}</span> {access}
      </a>
    </div>
    <span className='project'>{project}</span>
    <span className='created-by'> - {user.name}</span>
    <div className='updated-time'>last updated: {updated_at}</div>
    <div>description</div>
    <div className='description'>{description}</div>
  </div>
)

export default ManifestPreview