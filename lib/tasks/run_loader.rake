namespace :timur do
  desc "Re-run loaders for a given object type using the existing file uploads."
  task :rerun_loader, [ :model, :attribute, :ext ] => [:environment] do |t,args|
    model = Magma.instance.get_model(args[:model])
    att = args[:attribute].to_sym
    raise "Could not find attribute #{att} on model #{model}" unless model.attributes[att]
    model.attributes[att].loader
    model.all.each do |record|
      next unless file = record.send(att).file
      next unless record[att] =~ /#{args[:ext]}/
      record.run_loaders att, file
    end
  end
end
