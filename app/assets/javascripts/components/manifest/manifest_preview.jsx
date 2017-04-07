const ManifestPreview = ({ name, project, updated_at, description, is_editable, user, access, handleDelete, handleClick }) => (
  <div className='manifest-preview'>
    {is_editable &&
      <a className='delete' href='#' onClick={handleDelete}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </a>
    }
    <div onClick={handleClick}>
      <div className='name'>{name}</div>
      <div className='project'>{project}</div>
      <div className='access'>{access}</div>
      <div className='created-by'> created by: {user.name}</div>
      <div className='updated-time'>last updated: {updated_at}</div>
      <div>description</div>
      <div className='description'>{description}</div>
    </div>
  </div>
)

export default ManifestPreview