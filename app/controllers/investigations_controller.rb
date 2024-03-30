class InvestigationsController < ApplicationController
    before_action :set_investigation, only: [:show, :edit, :update, :destroy, :close]
    before_action :check_login
    authorize_resource
  
    def index
      @open_investigations = Investigation.is_open.chronological
      @closed_investigations = Investigation.is_closed.chronological
      @closed_unsolved = Investigation.unsolved
      @with_batman = Investigation.with_batman
      @unassigned_cases = Investigation.unassigned
    end
  
    def new
      @investigation = Investigation.new
    end
  
    def create
      @investigation = Investigation.new(investigation_params)
      if @investigation.save
        flash[:notice] = "Successfully added '#{@investigation.title}' to GCPD."
        redirect_to @investigation
      else
        render :new
      end
    end
  
    def show
      @current_assignments = @investigation.assignments.current
    end
  
    def edit; end
  
    def update
      if @investigation.update(investigation_params)
        flash[:notice] = "Successfully updated the investigation."
        redirect_to @investigation
      else
        render :edit
      end
    end
  
    def close
        @investigation = Investigation.find(params[:id])
        if @investigation.update(date_closed: Date.current)
          flash[:notice] = "Investigation has been closed."
          redirect_to investigations_path
        else
          flash[:error] = "Investigation could not be closed."
          render :show
        end
    end
      
  
    private
  
    def set_investigation
      @investigation = Investigation.find(params[:id])
    end
  
    def investigation_params
      params.require(:investigation).permit(:title, :description, :crime_location, :date_opened, :date_closed, :solved, :batman_involved)
    end
  end
  