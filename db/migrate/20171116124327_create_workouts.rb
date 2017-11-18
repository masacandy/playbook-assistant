class CreateWorkouts < ActiveRecord::Migration[5.1]
  def change
    create_table :workouts do |t|
      t.integer :user_id, null:false
      t.integer :menu_id, null:false
      t.boolean :finished, null: false, default: false

      t.timestamps
    end

    add_index :workouts, %i[user_id menu_id]
  end
end
