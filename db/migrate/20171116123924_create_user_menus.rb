class CreateUserMenus < ActiveRecord::Migration[5.1]
  def change
    create_table :user_menus do |t|
      t.integer :user_id, null: false
      t.integer :menu_id, null: false

      t.timestamps
    end

    add_index :user_menus, %i[user_id menu_id], unique: true
  end
end
