class AddImageUrlAndYoutubeUrlToExercise < ActiveRecord::Migration[5.1]
  def change
    add_column :exercises, :detail_url, :string, after: :point
    add_column :exercises, :image_url, :string, after: :detail_url
    add_column :exercises, :youtube_url, :string, after: :image_url
  end
end
