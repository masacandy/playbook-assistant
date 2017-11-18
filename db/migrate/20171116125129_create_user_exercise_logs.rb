class CreateUserExerciseLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :user_exercise_logs do |t|
      t.integer :user_id, null: false
      t.integer :workout_id, null: false
      t.integer :exercise_id, null: false
      t.float :weight, null: false
      t.integer :reps, null: false

      t.timestamps
    end

    add_index :user_exercise_logs, %i[user_id workout_id exercise_id], name: 'user_exercise_logs_index_on_u_w_e'
    add_index :user_exercise_logs, %i[user_id exercise_id]
  end
end
