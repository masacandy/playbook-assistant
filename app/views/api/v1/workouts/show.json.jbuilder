json.workout_messages @workout.workout_messages.order(id: :asc), :message, :message_type, :next_action_type
json.current_menu_id @workout.menu_id

json.current_exercise do
  json.id @current_exercise&.id
  json.rep @current_exercise&.rep
  json.latest_weight @current_exercise&.latest_weight
  json.image_url @current_exercise&.image_url
end
