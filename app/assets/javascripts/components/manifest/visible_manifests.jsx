import ManifestPreview from './manifest_preview'

export default ({ visibleManifests, handleClick }) => {
  const manifests = visibleManifests.map(manifest => {
    const handleSelect = () => handleClick(manifest.id)
    const props = { ...manifest, handleClick }
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