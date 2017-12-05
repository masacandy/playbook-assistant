class CreateWorkoutMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :workout_messages do |t|
      t.integer :workout_id, null: false
      t.string :message, null: false
      t.integer :message_type, null: false, limit: 1
      t.integer :next_action_type, null: false, limit: 1
      t.integer :parent_id

      t.timestamps
    end

    add_index :workout_messages, %i[workout_id parent_id], unique: true
  end
end
