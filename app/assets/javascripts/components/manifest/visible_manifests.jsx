import ManifestPreview from './manifest_preview'

const VisibleManifests = ({ visibleManifests, handleClick }) => {
  const manifests = visibleManifests.map(manifest => {
    const props = {
      ...manifest, 
      handleClick: () => handleClick(manifest.id)
    }
    return (
     <li key={manifest.id}>
       <ManifestPreview {...props} />
      </li>
    )
  })

  return (
    <ol>
      <li>
        <button onClick={() => handleClick('new')}>New Manifest</button>
      </li>
      {manifests}
    </ol>
  )
}

export default VisibleManifests