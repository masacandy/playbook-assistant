json.id @menu.id
json.name @menu.name

json.exercises @menu.exercises.order(id: :asc), :id, :name
