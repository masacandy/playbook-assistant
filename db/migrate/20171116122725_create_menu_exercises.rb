class CreateMenuExercises < ActiveRecord::Migration[5.1]
  def change
    create_table :menu_exercises do |t|
      t.integer :menu_id, null: false
      t.integer :exercise_id, null: false
      t.integer :rep, null: false
      t.integer :set, null: false
      t.integer :sort, null: false

      t.timestamps
    end

    add_index :menu_exercises, %i[menu_id exercise_id], unique: true
    add_index :menu_exercises, %i[exercise_id]
  end
end
