class InvestigationNotesController < ApplicationController
    def new
      @investigation_note = InvestigationNote.new
      @investigation = Investigation.find(params[:investigation_id])
    end
  
    def create
      @investigation_note = InvestigationNote.new(investigation_note_params)
      if @investigation_note.save
        flash[:notice] = "Successfully added investigation note."
        redirect_to investigation_path(@investigation_note.investigation)
      else
        render :new
      end
    end
  
    private

    def investigation_note_params
      params.require(:investigation_note).permit(:investigation_id, :officer_id, :content, :date)
    end
  end
  