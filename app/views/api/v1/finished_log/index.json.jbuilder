json.set! :workout_log do
  json.array! @workout_log do |log|
    json.name log.second[:name]

    json.set! :sets do
      json.array! log.second[:sets] do |set|
        json.weight set.weight
        json.rep set.rep
      end
    end
  end
end
