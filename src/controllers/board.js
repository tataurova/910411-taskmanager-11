import LoadMoreButtonComponent from "../components/load-more-button.js";
import TaskEditComponent from "../components/task-edit.js";
import TaskComponent from "../components/task.js";
import TasksComponent from "../components/tasks.js";
import NoTasksComponent from "../components/no-tasks.js";
import SortComponent, {SortType} from "../components/sort.js";
import {render, remove} from "../utils/render.js";
import {isEscKey} from "../utils/keyboard.js";
import {TaskCount} from "../const.js";

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler(() => {
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(container, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + TaskCount.BY_BUTTON;

        const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, showingTasksCount);

        renderTasks(taskListElement, sortedTasks);

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    const container = this._container.getElement();
    const isAllTasksArchived = !tasks.some((task) => task.isArchive === false);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent());
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = TaskCount.ON_START;

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));

    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = TaskCount.BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);

      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);
      renderLoadMoreButton();
    });
  }
}
