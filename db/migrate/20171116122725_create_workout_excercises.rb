class CreateWorkoutExcercises < ActiveRecord::Migration[5.1]
  def change
    create_table :workout_excercises do |t|
      t.integer :workout_id, null: false
      t.integer :excercise_id, null: false
      t.integer :rep, null: false
      t.integer :sort, null: false

      t.timestamps
    end

    add_index :workout_excercises, %i[workout_id excercise_id], unique: true
    add_index :workout_excercises, %i[excercise_id]
  end
end
