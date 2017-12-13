json.workout_messages @workout_messages, :message, :message_type, :next_action_type

json.current_menu do
  json.id @workout.menu_id
end

json.current_exercise do
  json.id @current_exercise.id
  json.rep @current_exercise.rep
end

json.weight @weight
