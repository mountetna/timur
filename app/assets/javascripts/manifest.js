export class Manifest {
  constructor(name,manifest) {
    self.manifest = manifest
    self.name = name
  }

  var(var_name) {
    if (manifest.hasOwnProperty(var_name)) {
      switch(var_name) {
      }
    }
  }
}
