class Api::V1::WorkoutMessagesController < Api::V1::BaseController
  def index
    @workout_messages = WorkoutMessage.where(workout_id: params[:workout_id])&.order(parent_id: :asc)

    # 途中で更新していた場合
    return if @workout_messages.exists?

    # 最初のメッセージ作成
    CreateWorkoutMessagesService.call(workout_id: params[:workout_id], user_id: current_user.id)

    @workout_messages.reload
  end
end

class CreateWorkoutMessagesService
  attr_accessor :workout, :user_id, :messages

  BaseWorkoutMessage = Struct.new(:message, :next_action_type)

  def self.call(workout_id:, user_id:)
    new(workout_id, user_id).call
  end

  def initialize(workout_id, user_id)
    @workout = Workout.find(workout_id)
    @user_id = user_id
    @messages = []
  end

  def call
    exercise = workout.menu.menu_exercises.order(sort: :asc).first.exercise

    last_user_last_exercise_log = UserLastExerciseLog.where(
      user_id: user_id,
      exercise_id: exercise.id
    )&.last

    return create_whats_your_weight_message(exercise) if last_user_last_exercise_log.nil?

    workout_exercise = exercises.workout_exercises.where(menu_id: workout.menu_id).first
    messages.push(BaseWorkoutMessage.new(
      "最初の種目は#{exercise.name}です",
      WorkoutMessage.next_action_types[:assistant_message]
    ))

    if last_user_last_exercise_log.weight_up?
      messages.push(BaseWorkoutMessage.new(
        "前回#{last_user_last_exercise_log.weight}kgをクリアしました。", "今回は#{last_user_last_exercise_log + 2.5}kgで#{workout_exercise.rep}回#{workout_exercise.set}セット行います。", "それでは1セット目スタート!", "何回できたか教えてください。",
        WorkoutMessage.next_action_types[:user_input_reps]
      ))
    else
      messages.push(BaseWorkoutMessage.new(
        "前回#{last_user_last_exercise_log}kgでした", "今回は#{workout_exercise.rep}回#{workout_exercise.set}セットをクリアできるように頑張りましょう", "それでは1セット目スタート!", "何回できたか教えてください",
        WorkoutMessage.next_action_types[:user_input_reps]
      ))
    end

    create_assistant_messages
  end

  def create_whats_your_weight_message(exercise)
    first_message = BaseWorkoutMessage.new(
      "最初の種目は#{exercise.name}です",
      WorkoutMessage.next_action_types[:assistant_message]
    )
    second_message = BaseWorkoutMessage.new(
      '今回挑戦する重さを教えてください',
      WorkoutMessage.next_action_types[:user_input_weight]
    )

    messages.push(first_message, second_message)

    create_assistant_messages
  end

  def create_assistant_messages
    messages.each do |message|
      workout_message = WorkoutMessage.new(
        workout_id: workout.id,
        message: message.message,
        message_type: WorkoutMessage.message_types[:assistant],
        next_action_type: message.next_action_type
      )

      if new_workout_message?
        workout_message.save!
        next
      end

      workout_message.parent_id = last_workout_message.id
      workout_message.save!
    end
  end

  def new_workout_message?
    !WorkoutMessage.where(workout_id: workout.id).exists?
  end

  def last_workout_message
    WorkoutMessage.where(workout_id: workout.id).last
  end
end
