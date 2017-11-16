class CreateUserWorkoutLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :user_workout_logs do |t|
      t.integer :user_id, null:false
      t.integer :workout_id, null:false

      t.timestamps
    end

    add_index :user_workout_logs, %i[user_id]
  end
end
