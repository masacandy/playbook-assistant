class CreateUserLastExerciseLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :user_last_exercise_logs do |t|
      t.integer :user_id, null: false
      t.integer :exercise_id, null: false
      t.float :weight, null: false
      t.boolean :weight_up, null: false, default: false

      t.timestamps
    end

    add_index :user_last_exercise_logs, %i[user_id exercise_id]
  end
end
