Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'web/top#index'

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      if Rails.env.development?
        resources :test, only: %i[index]
      end
      resources :workouts, only: %[show]

      namespace :workouts do
        namespace :messages do
          resources :weights, only: %i[create]
          resources :reps, only: %i[create]
          resources :skip, only: %i[create]

          namespace :exercises do
            resources :unfinished, only: %[index]
            resources :select, only: %[create]
            resources :choose, only: %[create]
          end
        end
      end
    end
  end

  scope module: :web, defaults: { format: :html } do
    resources :user, only: [] do
      collection do
        resources :workouts, only: %i[create show] do
          resources :finish, only: %i[index], controller: 'workouts/finish'
        end
      end
    end
  end
end
