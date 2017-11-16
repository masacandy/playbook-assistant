class CreateUserWorkouts < ActiveRecord::Migration[5.1]
  def change
    create_table :user_workouts do |t|
      t.integer :user_id, null: false
      t.integer :workout_id, null: false

      t.timestamps
    end

    add_index :user_workouts, %i[user_id workout_id], unique: true
  end
end
