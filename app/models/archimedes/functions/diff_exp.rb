module Archimedes
  class DiffExp < Archimedes::Function
    def call
      matrix, p_value, group_one, group_two = @args

      input = matrix.to_matrix

      input['key'] = ''
      input['name'] = ''

      labels =  group_one.to_values.map{ |l| {label: l, value: 1} } + group_two.to_values.map{ |l| {label: l, value: 2} }
      params = {method: 'DE', p_value: p_value, labels: labels}
      response = Pythia.instance.get([input], params)

      if response['error']
        response
      else
        DataTable.from_matrix(response['method_params']['series'][0]['matrix'])
      end
    end
  end
end
