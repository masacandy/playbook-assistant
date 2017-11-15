json.data(@comment) do |data|
  json.extract!(data, :comment, :number)
end
