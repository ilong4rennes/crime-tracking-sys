class AssignmentsController < ApplicationController
    # before_action :set_officer, only: [:new, :create
    before_action :check_login
    authorize_resource
  
    def new
      @assignment = Assignment.new
      unless params[:officer_id].nil?
        @officer = Officer.find(params[:officer_id])
        @officer_investigations = @officer.assignments.current.map{|a| a.investigation}
      end
    end
  
    def create
      @assignment = Assignment.new(assignment_params)
      @assignment.start_date = Date.current
      if @assignment.save
        flash[:notice] = "Successfully added assignment."
        redirect_to officer_path(@assignment.officer)
      else
        @officer = Officer.find(params[:assignment][:officer_id])
        # @unit = @officer.unit
        render action: 'new', locals: { officer: @officer } #, unit: @unit}
      end
    end
  
    def terminate
        @assignment = Assignment.find(params[:id])
        @assignment.terminate
        flash[:notice] = "Successfully terminated assignment."
        redirect_to officer_path(@assignment.officer)
    end
  
    private
  
    def assignment_params
        params.require(:assignment).permit(:officer_id, :investigation_id, :start_date, :end_date)
      end
      
  end
  