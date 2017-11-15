json.comments(@comments) do |data|
  json.extract!(data, :comment, :number)
end
