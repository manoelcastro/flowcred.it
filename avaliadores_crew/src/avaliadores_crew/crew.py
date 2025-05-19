from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import PDFSearchTool, CSVSearchTool, JSONSearchTool, DOCXSearchTool, XMLSearchTool, FileReadTool
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from avaliadores_crew.models.document_output import ContratoSocialOutput

# If you want to run a snippet of code before or after the crew starts, 
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

docs_tool = DOCXSearchTool()
file_tool = FileReadTool()
pdf_tool = PDFSearchTool()
csv_tool = CSVSearchTool()
json_tool = JSONSearchTool()
xml_tool = XMLSearchTool()

@CrewBase
class AvaliadoresCrew():
	"""AvaliadoresCrew crew"""

	# Learn more about YAML configuration files here:
	# Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
	# Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
	# agents_config = 'config/agents.yaml'
	# tasks_config = 'config/tasks.yaml'


	agents: List[BaseAgent]
	tasks: List[Task]

	# If you would like to add tools to your agents, you can learn more about it here:
	# https://docs.crewai.com/concepts/agents#agent-tools
	@agent
	def document_analyst(self) -> Agent:
		return Agent(
			config=self.agents_config['document_analyst'],
			tools=[docs_tool, file_tool, pdf_tool, csv_tool, json_tool, xml_tool],
			verbose=True
		)

	@agent
	def legal_financial_researcher(self) -> Agent:
		return Agent(
			config=self.agents_config['legal_financial_researcher'],
			tools=[docs_tool, file_tool, pdf_tool, csv_tool, json_tool, xml_tool],
			verbose=True
		)

	@agent
	def risk_assessment_specialist(self) -> Agent:
		return Agent(
			config=self.agents_config['risk_assessment_specialist'],
			tools=[docs_tool, file_tool, pdf_tool, csv_tool, json_tool, xml_tool],
			verbose=True
		)
	
	@agent
	def reporting_analyst(self) -> Agent:
		return Agent(
			config=self.agents_config['risk_assessment_specialist'],
			tools=[docs_tool, file_tool, pdf_tool, csv_tool, json_tool, xml_tool],
			verbose=True
		)

	# To learn more about structured task outputs, 
	# task dependencies, and task callbacks, check out the documentation:
	# https://docs.crewai.com/concepts/tasks#overview-of-a-task
	@task
	def document_analysis_task(self) -> Task:
		return Task(
			config=self.tasks_config['document_analysis_task'],
			tools=[docs_tool, file_tool, pdf_tool, csv_tool, json_tool, xml_tool],
		)
	
	@task
	def context_research_task(self) -> Task:
		return Task(
			config=self.tasks_config['context_research_task'],
			tools=[docs_tool, file_tool, pdf_tool, csv_tool, json_tool, xml_tool],
		)
	
	@task
	def risk_assessment_task(self) -> Task:
		return Task(
			config=self.tasks_config['risk_assessment_task'],
			tools=[docs_tool, file_tool, pdf_tool, csv_tool, json_tool, xml_tool],
		)

	@task
	def final_report_task(self) -> Task:
		return Task(
			config=self.tasks_config['final_report_task'],
			tools=[docs_tool, file_tool, pdf_tool, csv_tool, json_tool, xml_tool],
			output_pydantic=ContratoSocialOutput,
			output_file='report.json'		
		)

	@crew
	def crew(self) -> Crew:
		"""Creates the AvaliadoresCrew crew"""
		# To learn how to add knowledge sources to your crew, check out the documentation:
		# https://docs.crewai.com/concepts/knowledge#what-is-knowledge

		return Crew(
			agents=self.agents, # Automatically created by the @agent decorator
			tasks=self.tasks, # Automatically created by the @task decorator
			process=Process.sequential,
			verbose=True,
			# process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
		)
