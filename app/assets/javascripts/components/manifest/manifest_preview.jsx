const ManifestPreview = ({ name, project, updated_at, description, is_editable, user, handleDelete }) => (
  <div className='manifest-preview'>
    <a className='delete' href='#' onClick={handleDelete}>
      <i className="fa fa-times" aria-hidden="true"></i>
    </a>
    <div className='name'>{name}</div>
    <div className='project'>{project}</div>
    <div className='created-by'> created by: {user.name}</div>
    <div className='updated-time'>last updated: {updated_at}</div>
    <div>description</div>
    <div className='description'>{description}</div>
  </div>
)

export default ManifestPreview